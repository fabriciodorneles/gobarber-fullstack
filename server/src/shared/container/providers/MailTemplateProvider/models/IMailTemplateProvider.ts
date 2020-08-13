import IParseTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    // criou um DTO por que tem uma info com vário itens
    parse(data: IParseTemplateDTO): Promise<string>;
}
