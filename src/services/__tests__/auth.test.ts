import { validatePasswordStrength } from '../auth';

jest.mock('../firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

describe('validatePasswordStrength', () => {
  it('rejeita senha curta sem maiúscula, número e símbolo', () => {
    const resultado = validatePasswordStrength('abc');

    expect(resultado.valido).toBe(false);
    expect(resultado.forca).toBe('fraca');
    expect(resultado.erros).toContain('A senha deve ter no mínimo 8 caracteres.');
    expect(resultado.erros).toContain('A senha deve conter ao menos uma letra maiúscula.');
    expect(resultado.erros).toContain('A senha deve conter ao menos um número.');
    expect(resultado.erros).toContain('A senha deve conter ao menos um símbolo.');
  });

  it('exige símbolo mesmo quando os demais critérios são atendidos', () => {
    const resultado = validatePasswordStrength('Senha1234');

    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toEqual(['A senha deve conter ao menos um símbolo.']);
  });

  it('aceita senha que atende a todos os critérios como média', () => {
    const resultado = validatePasswordStrength('Senha@12');

    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toHaveLength(0);
    expect(resultado.forca).toBe('media');
  });

  it('classifica senha longa e completa como forte', () => {
    const resultado = validatePasswordStrength('SenhaForte@2024');

    expect(resultado.valido).toBe(true);
    expect(resultado.forca).toBe('forte');
  });
});
