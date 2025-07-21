// test/unit/validation.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { JsonModel } from '../../src/core/JsonModel'
import type { ModelData, ValidationRule } from '../../src/types'

interface User extends ModelData {
  nombre: string
  edad: number
  [key: string]: unknown
}

describe('JsonModel - Validaciones', () => {
  let model: JsonModel<User>

  const nombreNoVacio: ValidationRule = {
    validate: (value) => !!value || 'El nombre es obligatorio',
    message: 'Nombre requerido'
  }

  const edadMayor18: ValidationRule = {
    validate: (value) => typeof value === 'number' && value >= 18 || 'Debe ser mayor de edad',
    message: 'Edad mínima: 18'
  }

  beforeEach(() => {
    model = new JsonModel<User>(
      { nombre: '', edad: 0 },
      { enableValidation: true }
    )
  })

  it('debe aceptar valores válidos', () => {
    model.addValidator('/nombre', nombreNoVacio)
    model.addValidator('/edad', edadMayor18)

    model.setProperty('/nombre', 'Carlos')
    model.setProperty('/edad', 25)

    expect(model.validate('/nombre')).toBe(true)
    expect(model.validate('/edad')).toBe(true)
    expect(model.getErrors('/nombre')).toHaveLength(0)
    expect(model.getErrors('/edad')).toHaveLength(0)
  })

  it('debe detectar errores de validación', () => {
    model.addValidator('/nombre', nombreNoVacio)
    model.addValidator('/edad', edadMayor18)

    model.setProperty('/nombre', '')
    model.setProperty('/edad', 15)

    expect(model.validate('/nombre')).toBe(false)
    expect(model.validate('/edad')).toBe(false)

    const errors = model.getErrors()
    expect(errors).toContain('Nombre requerido')
    expect(errors).toContain('Edad mínima: 18')
  })

  it('debe remover un validador y dejar de validar ese campo', () => {
    model.addValidator('/nombre', nombreNoVacio)
    model.setProperty('/nombre', '') // Inválido

    expect(model.validate('/nombre')).toBe(false)

    model.removeValidator('/nombre')
    expect(model.validate('/nombre')).toBe(true)
  })

  it('debe validar todo el modelo con múltiples validadores', () => {
    model.addValidator('/nombre', nombreNoVacio)
    model.addValidator('/edad', edadMayor18)

    model.setProperty('/nombre', '')
    model.setProperty('/edad', 21)

    expect(model.validate()).toBe(false)

    model.setProperty('/nombre', 'Ana')
    expect(model.validate()).toBe(true)
  })
})
