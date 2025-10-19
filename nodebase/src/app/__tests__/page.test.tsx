/**
 * Unit tests for Home Page Component (src/app/page.tsx)
 * Tests cover:
 * - Async data fetching from database
 * - Rendering of user data
 * - Error handling
 * - Edge cases with different data states
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '../page'
import prisma from '@/lib/db'

// Mock the Prisma client
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
    },
  },
}))

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}))

describe('Page Component', () => {
  const mockPrismaUserFindMany = prisma.user.findMany as jest.MockedFunction<
    typeof prisma.user.findMany
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Data Fetching', () => {
    it('should render users data when fetch is successful', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', name: 'User One' },
        { id: 2, email: 'user2@example.com', name: 'User Two' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedData = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedData).toBeInTheDocument()
    })

    it('should call prisma.user.findMany without arguments', async () => {
      mockPrismaUserFindMany.mockResolvedValue([])

      await Page()

      expect(mockPrismaUserFindMany).toHaveBeenCalledTimes(1)
      expect(mockPrismaUserFindMany).toHaveBeenCalledWith()
    })

    it('should render single user correctly', async () => {
      const mockUser = [{ id: 1, email: 'single@example.com', name: 'Single User' }]
      mockPrismaUserFindMany.mockResolvedValue(mockUser)

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText(JSON.stringify(mockUser))).toBeInTheDocument()
    })

    it('should render multiple users with all fields', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', name: 'Alice' },
        { id: 2, email: 'user2@test.com', name: 'Bob' },
        { id: 3, email: 'user3@test.com', name: 'Charlie' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedText = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedText).toBeInTheDocument()
      
      // Verify the JSON contains all user data
      const renderedData = JSON.parse(displayedText.textContent || '[]')
      expect(renderedData).toHaveLength(3)
      expect(renderedData[0]).toMatchObject(mockUsers[0])
      expect(renderedData[1]).toMatchObject(mockUsers[1])
      expect(renderedData[2]).toMatchObject(mockUsers[2])
    })
  })

  describe('Empty Data States', () => {
    it('should render empty array when no users exist', async () => {
      mockPrismaUserFindMany.mockResolvedValue([])

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText('[]')).toBeInTheDocument()
    })

    it('should handle null name fields', async () => {
      const mockUsers = [
        { id: 1, email: 'user@example.com', name: null },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers as any)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedData = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedData).toBeInTheDocument()
      expect(displayedData.textContent).toContain('null')
    })

    it('should handle users with only required fields', async () => {
      const mockUsers = [
        { id: 5, email: 'minimal@example.com', name: null },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers as any)

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText(JSON.stringify(mockUsers))).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Data Variations', () => {
    it('should handle large datasets', async () => {
      const mockUsers = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
      }))
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedData = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedData).toBeInTheDocument()
      
      const renderedData = JSON.parse(displayedData.textContent || '[]')
      expect(renderedData).toHaveLength(100)
    })

    it('should handle special characters in user data', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test+tag@example.com',
          name: "O'Brien \"The Developer\"",
        },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedText = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedText).toBeInTheDocument()
    })

    it('should handle unicode characters in names', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', name: '李明' },
        { id: 2, email: 'user2@test.com', name: 'José García' },
        { id: 3, email: 'user3@test.com', name: 'Müller' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedData = screen.getByText(JSON.stringify(mockUsers))
      expect(displayedData).toBeInTheDocument()
    })

    it('should handle very long email addresses', async () => {
      const longEmail = 'verylongemailaddressthatexceedsnormallimits@subdomain.example.com'
      const mockUsers = [
        { id: 1, email: longEmail, name: 'Long Email User' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText(JSON.stringify(mockUsers))).toBeInTheDocument()
    })

    it('should handle users with empty string names', async () => {
      const mockUsers = [
        { id: 1, email: 'user@test.com', name: '' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText(JSON.stringify(mockUsers))).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockPrismaUserFindMany.mockRejectedValue(new Error('Database connection failed'))

      await expect(async () => {
        await Page()
      }).rejects.toThrow('Database connection failed')
    })

    it('should handle query timeout errors', async () => {
      mockPrismaUserFindMany.mockRejectedValue(new Error('Query timeout'))

      await expect(async () => {
        await Page()
      }).rejects.toThrow('Query timeout')
    })

    it('should handle Prisma client errors', async () => {
      mockPrismaUserFindMany.mockRejectedValue(
        new Error('Prisma Client: Invalid query')
      )

      await expect(async () => {
        await Page()
      }).rejects.toThrow('Prisma Client: Invalid query')
    })

    it('should handle network errors', async () => {
      mockPrismaUserFindMany.mockRejectedValue(new Error('Network error'))

      await expect(async () => {
        await Page()
      }).rejects.toThrow('Network error')
    })

    it('should handle unexpected null response', async () => {
      mockPrismaUserFindMany.mockResolvedValue(null as any)

      const PageComponent = await Page()
      render(PageComponent)

      expect(screen.getByText('null')).toBeInTheDocument()
    })
  })

  describe('Rendering Structure', () => {
    it('should render data within a div element', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com', name: 'Test' }]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      const { container } = render(PageComponent)

      const divElement = container.querySelector('div')
      expect(divElement).toBeInTheDocument()
      expect(divElement?.textContent).toBe(JSON.stringify(mockUsers))
    })

    it('should render only user data without additional UI elements', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com', name: 'Test' }]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      const { container } = render(PageComponent)

      // Should only have one div with the data
      const divs = container.querySelectorAll('div')
      expect(divs).toHaveLength(1)
    })

    it('should properly serialize complex nested data structures', async () => {
      // Even though the schema doesn't return nested data, test JSON serialization
      const mockUsers = [
        { id: 1, email: 'test@example.com', name: 'Test User' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedText = screen.getByText(JSON.stringify(mockUsers))
      const parsed = JSON.parse(displayedText.textContent || '[]')
      expect(parsed).toEqual(mockUsers)
    })
  })

  describe('Async Behavior', () => {
    it('should be an async component', () => {
      expect(Page).toBeInstanceOf(Function)
      const result = Page()
      expect(result).toBeInstanceOf(Promise)
    })

    it('should wait for data before rendering', async () => {
      const mockUsers = [{ id: 1, email: 'async@test.com', name: 'Async User' }]
      
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      mockPrismaUserFindMany.mockReturnValue(promise as any)

      // Start rendering but don't await
      const pagePromise = Page()

      // Resolve the data
      resolvePromise!(mockUsers)
      
      // Now await the page render
      const PageComponent = await pagePromise
      render(PageComponent)

      expect(screen.getByText(JSON.stringify(mockUsers))).toBeInTheDocument()
    })
  })

  describe('Data Integrity', () => {
    it('should not modify fetched user data', async () => {
      const mockUsers = [
        { id: 1, email: 'original@test.com', name: 'Original' },
      ]
      const originalData = JSON.parse(JSON.stringify(mockUsers))
      
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      // Verify original data wasn't mutated
      expect(mockUsers).toEqual(originalData)
    })

    it('should preserve data types in JSON serialization', async () => {
      const mockUsers = [
        { id: 1, email: 'type@test.com', name: 'Type Test' },
      ]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      const PageComponent = await Page()
      render(PageComponent)

      const displayedText = screen.getByText(JSON.stringify(mockUsers))
      const parsed = JSON.parse(displayedText.textContent || '[]')
      
      expect(typeof parsed[0].id).toBe('number')
      expect(typeof parsed[0].email).toBe('string')
      expect(typeof parsed[0].name).toBe('string')
    })
  })

  describe('Performance Considerations', () => {
    it('should fetch data only once per render', async () => {
      mockPrismaUserFindMany.mockResolvedValue([])

      await Page()

      expect(mockPrismaUserFindMany).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid successive calls', async () => {
      const mockUsers = [{ id: 1, email: 'rapid@test.com', name: 'Rapid' }]
      mockPrismaUserFindMany.mockResolvedValue(mockUsers)

      // Call Page multiple times
      const results = await Promise.all([Page(), Page(), Page()])

      // Each should call findMany once
      expect(mockPrismaUserFindMany).toHaveBeenCalledTimes(3)
      
      // All should render correctly
      results.forEach(result => {
        render(result)
        expect(screen.getAllByText(JSON.stringify(mockUsers)).length).toBeGreaterThan(0)
      })
    })
  })
})