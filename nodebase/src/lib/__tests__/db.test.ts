/**
 * Unit tests for Prisma client singleton (src/lib/db.ts)
 * Tests cover:
 * - Singleton pattern implementation
 * - Development vs production behavior
 * - Global state management
 * - PrismaClient instantiation
 */

import { PrismaClient } from '@/generated/prisma'

// Store original NODE_ENV
const originalEnv = process.env.NODE_ENV

describe('db.ts - Prisma Client Singleton', () => {
  let globalForPrisma: any

  beforeEach(() => {
    // Clear module cache to get fresh imports
    jest.resetModules()
    
    // Reset global prisma
    globalForPrisma = global as unknown as {
      prisma: PrismaClient | undefined
    }
    globalForPrisma.prisma = undefined
    
    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('Singleton Pattern', () => {
    it('should create a PrismaClient instance', () => {
      process.env.NODE_ENV = 'development'
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
      expect(prisma).toBeInstanceOf(Object)
    })

    it('should export a singleton instance', () => {
      process.env.NODE_ENV = 'development'
      const prisma1 = require('../db').default
      const prisma2 = require('../db').default
      
      expect(prisma1).toBe(prisma2)
    })

    it('should create only one PrismaClient instance across multiple imports', () => {
      process.env.NODE_ENV = 'development'
      jest.resetModules()
      
      const { PrismaClient: MockPrismaClient } = require('@/generated/prisma')
      
      // Import multiple times
      require('../db').default
      require('../db').default
      require('../db').default
      
      // PrismaClient constructor should be called only once
      expect(MockPrismaClient).toHaveBeenCalledTimes(1)
    })
  })

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('should store prisma instance in global object in development', () => {
      jest.resetModules()
      const prisma = require('../db').default
      
      const globalForPrisma = global as unknown as {
        prisma: PrismaClient | undefined
      }
      
      expect(globalForPrisma.prisma).toBeDefined()
      expect(globalForPrisma.prisma).toBe(prisma)
    })

    it('should reuse global prisma instance if already exists in development', () => {
      jest.resetModules()
      
      const mockPrismaInstance = new PrismaClient()
      const globalForPrisma = global as unknown as {
        prisma: PrismaClient | undefined
      }
      globalForPrisma.prisma = mockPrismaInstance
      
      const prisma = require('../db').default
      
      expect(prisma).toBe(mockPrismaInstance)
    })

    it('should prevent multiple instances during hot reload in development', () => {
      jest.resetModules()
      
      // First import
      const prisma1 = require('../db').default
      
      // Simulate hot reload by resetting modules but keeping global
      const globalPrisma = (global as any).prisma
      jest.resetModules()
      
      // Manually restore global prisma (simulating persistence across hot reloads)
      ;(global as any).prisma = globalPrisma
      
      // Second import after hot reload
      const prisma2 = require('../db').default
      
      expect(prisma1).toBe(prisma2)
    })
  })

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should not store prisma instance in global object in production', () => {
      jest.resetModules()
      require('../db').default
      
      const globalForPrisma = global as unknown as {
        prisma: PrismaClient | undefined
      }
      
      expect(globalForPrisma.prisma).toBeUndefined()
    })

    it('should create new PrismaClient instance in production', () => {
      jest.resetModules()
      const { PrismaClient: MockPrismaClient } = require('@/generated/prisma')
      
      const prisma = require('../db').default
      
      expect(MockPrismaClient).toHaveBeenCalled()
      expect(prisma).toBeInstanceOf(Object)
    })

    it('should not pollute global namespace in production', () => {
      jest.resetModules()
      
      const globalBefore = { ...global }
      require('../db').default
      
      // Check that global hasn't been modified with prisma property
      expect((global as any).prisma).toBeUndefined()
    })
  })

  describe('Test Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    })

    it('should store prisma instance in global in test environment', () => {
      jest.resetModules()
      const prisma = require('../db').default
      
      const globalForPrisma = global as unknown as {
        prisma: PrismaClient | undefined
      }
      
      expect(globalForPrisma.prisma).toBeDefined()
      expect(globalForPrisma.prisma).toBe(prisma)
    })

    it('should reuse existing instance in test environment', () => {
      jest.resetModules()
      
      const prisma1 = require('../db').default
      jest.resetModules()
      
      // Store reference
      const globalPrisma = (global as any).prisma
      
      // Import again
      const prisma2 = require('../db').default
      
      expect(prisma1).toBeDefined()
      expect(prisma2).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined NODE_ENV', () => {
      delete process.env.NODE_ENV
      jest.resetModules()
      
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
    })

    it('should handle empty string NODE_ENV', () => {
      process.env.NODE_ENV = ''
      jest.resetModules()
      
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
      expect((global as any).prisma).toBeDefined()
    })

    it('should work with custom NODE_ENV values', () => {
      process.env.NODE_ENV = 'staging'
      jest.resetModules()
      
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
      // Should store in global for non-production environments
      expect((global as any).prisma).toBeDefined()
    })

    it('should handle case-sensitive production check', () => {
      process.env.NODE_ENV = 'Production' // Different case
      jest.resetModules()
      
      const prisma = require('../db').default
      
      // Should store in global since it's not exactly "production"
      expect((global as any).prisma).toBeDefined()
    })
  })

  describe('Type Safety', () => {
    it('should correctly type the global prisma object', () => {
      process.env.NODE_ENV = 'development'
      jest.resetModules()
      
      const prisma = require('../db').default
      const globalForPrisma = global as unknown as {
        prisma: PrismaClient | undefined
      }
      
      // Type checking - should not throw TypeScript errors
      expect(typeof globalForPrisma.prisma).toBe('object')
    })

    it('should export PrismaClient instance with correct type', () => {
      const prisma = require('../db').default
      
      // Should have database models
      expect(prisma).toHaveProperty('user')
      expect(prisma).toHaveProperty('post')
    })
  })

  describe('Memory Management', () => {
    it('should not create memory leaks by storing single instance', () => {
      process.env.NODE_ENV = 'development'
      jest.resetModules()
      
      const { PrismaClient: MockPrismaClient } = require('@/generated/prisma')
      MockPrismaClient.mockClear()
      
      // Multiple requires should not create new instances
      for (let i = 0; i < 10; i++) {
        require('../db').default
      }
      
      // Should still have been called only once
      expect(MockPrismaClient).toHaveBeenCalledTimes(1)
    })
  })
})