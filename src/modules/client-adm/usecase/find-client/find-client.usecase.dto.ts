export interface FindClientInputDto {
  id: string;
}

export interface FindClientOutputDto {
  id: string;
  name: string;
  document: string;
  email: string;
  street: string,
  number: string,
  complement: string,
  city: string,
  state: string,
  zipCode: string,
  createdAt: Date;
  updatedAt: Date;
}
