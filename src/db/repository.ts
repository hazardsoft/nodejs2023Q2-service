export default abstract class GenericRepository<
  DataType,
  CreateDtoType,
  UpdateDtoType,
> {
  abstract findOne(id: string): Promise<DataType>;
  abstract findMany(): Promise<DataType[]>;
  abstract findSome(ids: string[]): Promise<DataType[]>;
  abstract create(dto: CreateDtoType): Promise<DataType>;
  abstract update(id: string, dto: UpdateDtoType): Promise<DataType>;
  abstract delete(id: string): Promise<DataType>;
}
