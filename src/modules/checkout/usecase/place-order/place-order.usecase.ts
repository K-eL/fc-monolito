
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.facade.factory";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import PaymentFacadeFactory from "../../../payment/factory/payment.facade.factory";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory";
import Client from "../../domain/entity/client.entity";
import Order from "../../domain/entity/order.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export interface PlaceOrderUseCaseFacadeProps {
	clientFacade?: ClientAdmFacadeInterface;
	productFacade?: ProductAdmFacadeInterface;
	catalogFacade?: StoreCatalogFacadeInterface;
	invoiceFacade?: InvoiceFacadeInterface;
	paymentFacade?: PaymentFacadeInterface;
}

export default class PlaceOrderUseCase implements UseCaseInterface {

	private clientFacade: ClientAdmFacadeInterface;
	private productFacade: ProductAdmFacadeInterface;
	private catalogFacade: StoreCatalogFacadeInterface;
	private invoiceFacade: InvoiceFacadeInterface;
	private paymentFacade: PaymentFacadeInterface;

	constructor(
		private repository: CheckoutGateway,
	) {
		this.clientFacade = ClientAdmFacadeFactory.create();
		this.productFacade = ProductAdmFacadeFactory.create();
		this.catalogFacade = StoreCatalogFacadeFactory.create();
		this.invoiceFacade = InvoiceFacadeFactory.create();
		this.paymentFacade = PaymentFacadeFactory.create();
	}

	async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
		const client = await this.clientFacade.find({ id: input.clientId });
		if (!client) {
			throw new Error("Client not found");
		}

		await this.validateProduct(input);

		const products = await Promise.all(
			input.products.map(async (p) => this.getProducts(p.productId))
		);

		const myClient = new Client({
			id: new Id(client.id),
			name: client.name,
			document: client.document,
			email: client.email,
			address: new Address({
				street: client.street,
				number: client.number,
				complement: client.complement,
				city: client.city,
				state: client.state,
				zipCode: client.zipCode,
			}),
			createdAt: client.createdAt,
			updatedAt: client.updatedAt,
		});

		const order = new Order({
			client: myClient,
			products
		})

		const payment = await this.paymentFacade.process({
			orderId: order.id.id,
			amount: order.total,
		});


		const invoice =
			payment.status === "approved"
				? await this.invoiceFacade.generate({
					name: client.name,
					document: client.document,
					street: client.street,
					number: client.number,
					complement: client.complement,
					city: client.city,
					state: client.state,
					zipCode: client.zipCode,
					items: products.map((p) => {
						return {
							id: p.id.id,
							name: p.name,
							price: p.salesPrice,
						}
					}),
				})
				: null;

		payment.status === "approved" && order.approved();

		this.repository.addOrder(order);

		await this.repository.addOrder(order);

		return {
			id: order.id.id,
			invoiceId: payment.status === "approved" ? invoice.id : null,
			status: order.status,
			total: order.total,
			products: order.products.map((p) => {
				return {
					id: p.id.id,
				}
			})
		}
	}
	private async validateProduct(input: PlaceOrderInputDto): Promise<void> {
		if (!input.products || input.products.length === 0) {
			throw new Error("No products selected");
		}

		for (const p of input.products) {
			const product = await this.productFacade.checkStock({
				productId: p.productId,
			});
			if (product.stock <= 0) {
				throw new Error(
					`Product ${product.productId} is not available in stock`
				);
			}
		}
	}

	private async getProducts(productId: string): Promise<Product> {
		const product = await this.catalogFacade.find({ id: productId });

		if (!product) {
			throw new Error(`Product not found`);
		}

		const productProps = {
			id: new Id(product.id),
			name: product.name,
			description: product.description,
			salesPrice: product.salesPrice,
		}
		return new Product(productProps);
	}
}