import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceSequelizeRepository implements InvoiceGateway {

	async generate(input: Invoice): Promise<void> {
		await InvoiceModel.create({
			id: input.id.id,
			name: input.name,
			document: input.document,
			street: input.address.street,
			number: input.address.number,
			complement: input.address.complement,
			city: input.address.city,
			state: input.address.state,
			zipCode: input.address.zipCode,
			items: input.items.map((item) => ({
				id: item.id.id,
				name: item.name,
				price: item.price,
			})),
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		}, {
			include: [{ model: InvoiceItemModel, as: "items" }]
		});
	}

	async find(id: string): Promise<Invoice> {
		const response = await InvoiceModel.findOne({
			where: { id },
			include: [{ model: InvoiceItemModel, as: "items" }]
		});

		if (!response) {
			throw new Error("Invoice not found");
		}

		return new Invoice({
			id: new Id(response.id),
			name: response.name,
			document: response.document,
			address: new Address({
				street: response.street,
				number: response.number,
				complement: response.complement,
				city: response.city,
				state: response.state,
				zipCode: response.zipCode,
			}),
			items: response.items.map((item) => {
				return new Product({
					id: new Id(item.id),
					name: item.name,
					price: item.price,
				})
			}),
			createdAt: response.createdAt,
			updatedAt: response.updatedAt,
		});
	}
}

