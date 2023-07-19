import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceSequelizeRepository from "../repository/sequelize/invoice.sequelize.repository";

export default class InvoiceRepositoryFactory {
	static create(): InvoiceGateway {
		return new InvoiceRepository(new InvoiceSequelizeRepository());
	};
}