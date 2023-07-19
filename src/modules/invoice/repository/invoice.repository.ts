import Invoice from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";

export default class InvoiceRepository implements InvoiceGateway {

	constructor(private repository: InvoiceGateway) { }

	async generate(input: Invoice): Promise<void> {
		return await this.repository.generate(input);
	}

	async find(id: string): Promise<Invoice> {
		return await this.repository.find(id);
	}
}
