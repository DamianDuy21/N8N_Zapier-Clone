/**
 * Validation tests for Prisma Schema (prisma/schema.prisma)
 * Tests cover:
 * - Schema structure validation
 * - Model definitions
 * - Field types and constraints
 * - Relations integrity
 * - Generator and datasource configuration
 */

import * as fs from 'fs'
import * as path from 'path'

describe('Prisma Schema Validation', () => {
  let schemaContent: string

  beforeAll(() => {
    const schemaPath = path.join(__dirname, '..', 'schema.prisma')
    schemaContent = fs.readFileSync(schemaPath, 'utf-8')
  })

  describe('Generator Configuration', () => {
    it('should have a client generator defined', () => {
      expect(schemaContent).toMatch(/generator\s+client\s*{/)
    })

    it('should use prisma-client-js provider', () => {
      expect(schemaContent).toMatch(/provider\s*=\s*"prisma-client-js"/)
    })

    it('should have custom output path configured', () => {
      expect(schemaContent).toMatch(/output\s*=\s*"\.\.\/src\/generated\/prisma"/)
    })

    it('should not have multiple client generators', () => {
      const matches = schemaContent.match(/generator\s+client\s*{/g)
      expect(matches).toHaveLength(1)
    })
  })

  describe('Datasource Configuration', () => {
    it('should have a datasource defined', () => {
      expect(schemaContent).toMatch(/datasource\s+db\s*{/)
    })

    it('should use postgresql provider', () => {
      expect(schemaContent).toMatch(/provider\s*=\s*"postgresql"/)
    })

    it('should use DATABASE_URL environment variable', () => {
      expect(schemaContent).toMatch(/url\s*=\s*env\("DATABASE_URL"\)/)
    })

    it('should have only one datasource defined', () => {
      const matches = schemaContent.match(/datasource\s+\w+\s*{/g)
      expect(matches).toHaveLength(1)
    })
  })

  describe('User Model', () => {
    it('should have User model defined', () => {
      expect(schemaContent).toMatch(/model\s+User\s*{/)
    })

    it('should have id field as primary key', () => {
      const userModel = extractModel(schemaContent, 'User')
      expect(userModel).toMatch(/id\s+Int\s+@id\s+@default\(autoincrement\(\)\)/)
    })

    it('should have email field as unique', () => {
      const userModel = extractModel(schemaContent, 'User')
      expect(userModel).toMatch(/email\s+String\s+@unique/)
    })

    it('should have optional name field', () => {
      const userModel = extractModel(schemaContent, 'User')
      expect(userModel).toMatch(/name\s+String\?/)
    })

    it('should have relation to Post model', () => {
      const userModel = extractModel(schemaContent, 'User')
      expect(userModel).toMatch(/posts\s+Post\[\]/)
    })

    it('should have all required fields for User', () => {
      const userModel = extractModel(schemaContent, 'User')
      expect(userModel).toMatch(/id\s+Int/)
      expect(userModel).toMatch(/email\s+String/)
      expect(userModel).toMatch(/name\s+String\?/)
      expect(userModel).toMatch(/posts\s+Post\[\]/)
    })

    it('should not have unexpected fields in User model', () => {
      const userModel = extractModel(schemaContent, 'User')
      const lines = userModel.split('\n').filter(line => 
        line.trim() && 
        !line.includes('model User') && 
        !line.includes('}') &&
        !line.trim().startsWith('//')
      )
      expect(lines.length).toBe(4) // id, email, name, posts
    })
  })

  describe('Post Model', () => {
    it('should have Post model defined', () => {
      expect(schemaContent).toMatch(/model\s+Post\s*{/)
    })

    it('should have id field as primary key with autoincrement', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/id\s+Int\s+@id\s+@default\(autoincrement\(\)\)/)
    })

    it('should have required title field', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/title\s+String/)
      expect(postModel).not.toMatch(/title\s+String\?/)
    })

    it('should have optional content field', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/content\s+String\?/)
    })

    it('should have published field with default false', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/published\s+Boolean\s+@default\(false\)/)
    })

    it('should have authorId foreign key field', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/authorId\s+Int/)
    })

    it('should have relation to User model', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/author\s+User\s+@relation\(fields:\s*\[authorId\],\s*references:\s*\[id\]\)/)
    })

    it('should have all required fields for Post', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/id\s+Int/)
      expect(postModel).toMatch(/title\s+String/)
      expect(postModel).toMatch(/content\s+String\?/)
      expect(postModel).toMatch(/published\s+Boolean/)
      expect(postModel).toMatch(/authorId\s+Int/)
      expect(postModel).toMatch(/author\s+User/)
    })
  })

  describe('Relations Integrity', () => {
    it('should have bidirectional relation between User and Post', () => {
      const userModel = extractModel(schemaContent, 'User')
      const postModel = extractModel(schemaContent, 'Post')
      
      expect(userModel).toMatch(/posts\s+Post\[\]/)
      expect(postModel).toMatch(/author\s+User/)
    })

    it('should have correct foreign key constraint in Post', () => {
      const postModel = extractModel(schemaContent, 'Post')
      expect(postModel).toMatch(/@relation\(fields:\s*\[authorId\],\s*references:\s*\[id\]\)/)
    })

    it('should reference correct field in User model', () => {
      const postModel = extractModel(schemaContent, 'Post')
      // Should reference User.id
      expect(postModel).toMatch(/references:\s*\[id\]/)
    })

    it('should use correct foreign key field name', () => {
      const postModel = extractModel(schemaContent, 'Post')
      // Should use authorId as foreign key
      expect(postModel).toMatch(/fields:\s*\[authorId\]/)
    })
  })

  describe('Field Types', () => {
    it('should use Int type for all id fields', () => {
      expect(schemaContent).toMatch(/id\s+Int\s+@id/)
      const models = schemaContent.match(/id\s+String\s+@id/g)
      expect(models).toBeNull()
    })

    it('should use String type for text fields', () => {
      expect(schemaContent).toMatch(/email\s+String/)
      expect(schemaContent).toMatch(/name\s+String\?/)
      expect(schemaContent).toMatch(/title\s+String/)
      expect(schemaContent).toMatch(/content\s+String\?/)
    })

    it('should use Boolean type for published field', () => {
      expect(schemaContent).toMatch(/published\s+Boolean/)
    })

    it('should use Int type for foreign keys', () => {
      expect(schemaContent).toMatch(/authorId\s+Int/)
    })
  })

  describe('Constraints and Defaults', () => {
    it('should have autoincrement on all id fields', () => {
      const userModel = extractModel(schemaContent, 'User')
      const postModel = extractModel(schemaContent, 'Post')
      
      expect(userModel).toMatch(/@default\(autoincrement\(\)\)/)
      expect(postModel).toMatch(/@default\(autoincrement\(\)\)/)
    })

    it('should have @unique constraint on email', () => {
      expect(schemaContent).toMatch(/email\s+String\s+@unique/)
    })

    it('should have default value for published field', () => {
      expect(schemaContent).toMatch(/published\s+Boolean\s+@default\(false\)/)
    })

    it('should have @id constraint on all id fields', () => {
      const userModel = extractModel(schemaContent, 'User')
      const postModel = extractModel(schemaContent, 'Post')
      
      expect(userModel).toMatch(/id\s+Int\s+@id/)
      expect(postModel).toMatch(/id\s+Int\s+@id/)
    })
  })

  describe('Schema Completeness', () => {
    it('should have exactly two models defined', () => {
      const models = schemaContent.match(/model\s+\w+\s*{/g)
      expect(models).toHaveLength(2)
    })

    it('should not have any syntax errors in model definitions', () => {
      // Check for balanced braces
      const openBraces = (schemaContent.match(/{/g) || []).length
      const closeBraces = (schemaContent.match(/}/g) || []).length
      expect(openBraces).toBe(closeBraces)
    })

    it('should have proper model naming conventions', () => {
      expect(schemaContent).toMatch(/model\s+User\s*{/)
      expect(schemaContent).toMatch(/model\s+Post\s*{/)
      
      // Should be PascalCase
      expect(schemaContent).not.toMatch(/model\s+user\s*{/)
      expect(schemaContent).not.toMatch(/model\s+post\s*{/)
    })
  })

  describe('Optional vs Required Fields', () => {
    it('should have required fields without question mark', () => {
      expect(schemaContent).toMatch(/email\s+String\s+@unique/)
      expect(schemaContent).toMatch(/title\s+String/)
      expect(schemaContent).not.toMatch(/email\s+String\?\s+@unique/)
      expect(schemaContent).not.toMatch(/title\s+String\?[^?]/)
    })

    it('should have optional fields with question mark', () => {
      expect(schemaContent).toMatch(/name\s+String\?/)
      expect(schemaContent).toMatch(/content\s+String\?/)
    })

    it('should not have foreign key fields as optional', () => {
      expect(schemaContent).toMatch(/authorId\s+Int[^?]/)
      expect(schemaContent).not.toMatch(/authorId\s+Int\?/)
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should not have duplicate field names in same model', () => {
      const userModel = extractModel(schemaContent, 'User')
      const postModel = extractModel(schemaContent, 'Post')
      
      const userFields = extractFieldNames(userModel)
      const postFields = extractFieldNames(postModel)
      
      expect(new Set(userFields).size).toBe(userFields.length)
      expect(new Set(postFields).size).toBe(postFields.length)
    })

    it('should have consistent field naming (camelCase)', () => {
      const fieldPattern = /^\s*(\w+)\s+\w+/gm
      let match
      const fields: string[] = []
      
      while ((match = fieldPattern.exec(schemaContent)) !== null) {
        if (!match[1].startsWith('model') && !match[1].startsWith('generator') && !match[1].startsWith('datasource')) {
          fields.push(match[1])
        }
      }
      
      fields.forEach(field => {
        // Should be camelCase (starts with lowercase)
        expect(field[0]).toBe(field[0].toLowerCase())
      })
    })

    it('should not have any TODO or FIXME comments', () => {
      expect(schemaContent).not.toMatch(/TODO/i)
      expect(schemaContent).not.toMatch(/FIXME/i)
    })
  })
})

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Helper function to extract a model definition
function extractModel(schema: string, modelName: string): string {
  // Validate that modelName is a valid identifier to prevent ReDoS
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(modelName)) {
    return ''
  }
  const escapedModelName = escapeRegExp(modelName)
  const regex = new RegExp(`model\\s+${escapedModelName}\\s*{[^}]{0,65536}}`, 's')
  const match = schema.match(regex)
  return match ? match[0] : ''
}

// Helper function to extract field names from a model
function extractFieldNames(modelContent: string): string[] {
  const lines = modelContent.split('\n')
  const fields: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('model') && !trimmed.startsWith('}') && !trimmed.startsWith('//')) {
      const fieldName = trimmed.split(/\s+/)[0]
      if (fieldName) {
        fields.push(fieldName)
      }
    }
  }
  
  return fields
}