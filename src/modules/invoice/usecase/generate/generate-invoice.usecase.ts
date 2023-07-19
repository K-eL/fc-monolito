import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

	constructor(private invoiceRepository: InvoiceGateway) { }

	async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

		const invoice = new Invoice({
			name: input.name,
			document: input.document,
			address: new Address({
				street: input.street,
				number: input.number,
				complement: input.complement,
				city: input.city,
				state: input.state,
				zipCode: input.zipCode,
			}),
			items: input.items.map((item) => {
				return new Product({
					id: new Id(item.id),
					name: item.name,
					price: item.price,
				})
			}),
		});

		await this.invoiceRepository.generate(invoice);

		return {
			...input,
			id: invoice.id.id,
			total: invoice.total,
		};
	}

}