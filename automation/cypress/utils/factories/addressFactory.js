import { faker } from '@faker-js/faker/locale/en_US';

/**
 * Gera dados de endereço aleatório compatível com o formulário de checkout do nopCommerce.
 * Utiliza locale en_US pois o demo está configurado com dados em inglês.
 *
 * @returns {Object} Objeto com os dados do endereço
 *
 * @example
 * import { createAddress } from '../utils/factories/addressFactory';
 * const address = createAddress();
 * // { firstName: 'John', lastName: 'Doe', email: '...', company: '...', country: 'United States', ... }
 */
export function createAddress() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    company: faker.company.name(),
    country: 'United States',
    state: 'California',
    city: faker.location.city(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    zip: faker.location.zipCode('#####'),
    phoneNumber: faker.phone.number('##########'),
    faxNumber: faker.phone.number('##########'),
  };
}
