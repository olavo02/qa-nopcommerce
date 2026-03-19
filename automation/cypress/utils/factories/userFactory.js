import { faker } from '@faker-js/faker/locale/en';

// Remove caracteres inválidos para o local-part do e-mail (espaços, acentos, etc.)
const sanitize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]/g, '');     // mantém apenas letras e números

/**
 * Gera dados de um novo usuário aleatório para uso nos testes.
 * Garante e-mail único a cada execução para evitar conflitos no ambiente compartilhado.
 * Usa locale 'en' para evitar nomes compostos com espaços/acentos no e-mail.
 *
 * @returns {Object} Objeto com os dados do usuário
 *
 * @example
 * import { createUser } from '../utils/factories/userFactory';
 * const user = createUser();
 * // { firstName: 'John', lastName: 'Smith', email: 'john.smith_abc12345@example.com', ... }
 */
export function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const uniqueSuffix = faker.string.alphanumeric(8).toLowerCase();

  return {
    firstName,
    lastName,
    email: `${sanitize(firstName)}.${sanitize(lastName)}_${uniqueSuffix}@example.com`,
    password: 'Teste@123',
    confirmPassword: 'Teste@123',
  };
}
