import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

interface InvoiceFacadeUseCases {
	generateInvoice: UseCaseInterface;
	findInvoice: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
	constructor(private useCases: InvoiceFacadeUseCases) { }

	async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
		return await this.useCases.generateInvoice.execute(input);
	}

	async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
		return await this.useCases.findInvoice.execute(input);
	}
}