import InvoiceFacade from "../facade/invoice.facade";
import InvoiceFacadeInterface from "../facade/invoice.facade.interface";
import FindInvoiceUseCase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoice.usecase";
import InvoiceRepositoryFactory from "./invoice.repository.factory";

export default class InvoiceFacadeFactory {
	static create(): InvoiceFacadeInterface {
		const repository = InvoiceRepositoryFactory.create();
		const generateInvoiceUsecase = new GenerateInvoiceUseCase(repository);
		const findInvoiceUsecase = new FindInvoiceUseCase(repository);

		const facade = new InvoiceFacade({
			generateInvoice: generateInvoiceUsecase,
			findInvoice: findInvoiceUsecase,
		});
		return facade;
	}
}
