import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/entity/client.entity";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Address from "../domain/value-object/address.value-object";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const clientEnt = new Client({
    id: new Id("1"),
    name: "Client 1",
    document: "00000000000",
    email: "x@x.com",
    address: new Address({
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "00000000",
    }),
  });

  const clientInput = {
    id: "1",
    name: "Client 1",
    document: "00000000000",
    email: "x@x.com",
    street: "Street 1",
    number: "1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "00000000",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should create a client", async () => {

    const repository = new ClientRepository();
    await repository.add(clientEnt);

    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(clientEnt.id.id);
    expect(clientDb.name).toBe(clientEnt.name);
    expect(clientDb.document).toBe(clientEnt.document);
    expect(clientDb.email).toBe(clientEnt.email);
    expect(clientDb.street).toBe(clientEnt.address.street);
    expect(clientDb.number).toBe(clientEnt.address.number);
    expect(clientDb.complement).toBe(clientEnt.address.complement);
    expect(clientDb.city).toBe(clientEnt.address.city);
    expect(clientDb.state).toBe(clientEnt.address.state);
    expect(clientDb.zipCode).toBe(clientEnt.address.zipCode);
    expect(clientDb.createdAt).toStrictEqual(clientEnt.createdAt);
    expect(clientDb.updatedAt).toStrictEqual(clientEnt.updatedAt);
  });

  it("should find a client", async () => {
    const client = await ClientModel.create(clientInput);
    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toEqual(client.street);
    expect(result.address.number).toEqual(client.number);
    expect(result.address.complement).toEqual(client.complement);
    expect(result.address.city).toEqual(client.city);
    expect(result.address.state).toEqual(client.state);
    expect(result.address.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });
});
