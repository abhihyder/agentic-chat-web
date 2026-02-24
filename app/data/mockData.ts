import { Conversation, Message } from '../types/chat';

// Mock data - Replace this with actual API responses later
export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'React Best Practices',
    createdAt: new Date('2026-02-23T10:00:00'),
    updatedAt: new Date('2026-02-23T10:15:00'),
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'What are the best practices for React component design?',
        timestamp: new Date('2026-02-23T10:00:00'),
      },
      {
        id: '1-2',
        role: 'assistant',
        content: `Here are some key best practices for React component design:

1. **Single Responsibility Principle**: Each component should do one thing well. If a component grows too large, consider breaking it into smaller sub-components.

2. **Use Functional Components**: Prefer functional components with hooks over class components for cleaner, more readable code.

3. **Props Destructuring**: Destructure props at the top of your component for better readability.

4. **Meaningful Names**: Use descriptive names for components, props, and state variables.

5. **Keep Components Small**: Aim for components under 200 lines. Large components are harder to maintain and test.

6. **Composition over Inheritance**: Use composition patterns like render props or children to share functionality.

Would you like me to elaborate on any of these points?`,
        timestamp: new Date('2026-02-23T10:00:30'),
      },
      {
        id: '1-3',
        role: 'user',
        content: 'Can you show me an example of composition?',
        timestamp: new Date('2026-02-23T10:05:00'),
      },
      {
        id: '1-4',
        role: 'assistant',
        content: `Of course! Here's a practical example of composition in React:

\`\`\`tsx
// Card component with composition
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div className={\`rounded-lg shadow-md p-4 \${className}\`}>
      {children}
    </div>
  );
}

// Specialized components using Card
function UserCard({ user }) {
  return (
    <Card className="bg-blue-50">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </Card>
  );
}

function ProductCard({ product }) {
  return (
    <Card className="bg-green-50">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
    </Card>
  );
}
\`\`\`

This approach allows you to:
- Reuse the base Card styling
- Customize each specialized card
- Keep components focused and testable`,
        timestamp: new Date('2026-02-23T10:05:30'),
      },
    ],
  },
  {
    id: '2',
    title: 'Python Data Analysis',
    createdAt: new Date('2026-02-22T14:00:00'),
    updatedAt: new Date('2026-02-22T14:30:00'),
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'How do I read a CSV file in Python using pandas?',
        timestamp: new Date('2026-02-22T14:00:00'),
      },
      {
        id: '2-2',
        role: 'assistant',
        content: `Reading CSV files with pandas is straightforward. Here's how:

\`\`\`python
import pandas as pd

# Basic usage
df = pd.read_csv('your_file.csv')

# With common options
df = pd.read_csv(
    'your_file.csv',
    sep=',',              # Delimiter (default is comma)
    header=0,             # Row number to use as column names
    index_col=None,       # Column to use as row index
    encoding='utf-8',     # File encoding
    na_values=['NA', ''], # Values to treat as NaN
)

# Preview the data
print(df.head())        # First 5 rows
print(df.info())        # Column types and memory usage
print(df.describe())    # Statistical summary
\`\`\`

Common options you might need:
- \`skiprows\`: Skip specific rows at the start
- \`nrows\`: Only read first n rows
- \`usecols\`: Select specific columns to load
- \`dtype\`: Specify column data types

Would you like to know about any specific data manipulation after loading?`,
        timestamp: new Date('2026-02-22T14:00:30'),
      },
    ],
  },
  {
    id: '3',
    title: 'Docker Basics',
    createdAt: new Date('2026-02-21T09:00:00'),
    updatedAt: new Date('2026-02-21T09:20:00'),
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'What is Docker and why should I use it?',
        timestamp: new Date('2026-02-21T09:00:00'),
      },
      {
        id: '3-2',
        role: 'assistant',
        content: `**Docker** is a platform for developing, shipping, and running applications in containers.

## What are Containers?
Containers are lightweight, standalone packages that include everything needed to run an application: code, runtime, system tools, libraries, and settings.

## Why Use Docker?

### 1. Consistency
- "Works on my machine" problem solved
- Same environment across development, testing, and production

### 2. Isolation
- Applications run independently
- No conflicts between different projects' dependencies

### 3. Portability
- Run anywhere Docker is installed
- Easy deployment to cloud services

### 4. Efficiency
- Lighter than virtual machines
- Faster startup times
- Better resource utilization

### 5. Scalability
- Easy to scale horizontally
- Perfect for microservices architecture

## Getting Started
\`\`\`bash
# Pull an image
docker pull nginx

# Run a container
docker run -d -p 80:80 nginx

# List running containers
docker ps

# Stop a container
docker stop <container_id>
\`\`\`

Would you like me to explain how to create your own Dockerfile?`,
        timestamp: new Date('2026-02-21T09:01:00'),
      },
    ],
  },
];

// Helper function to simulate API delay - useful for testing loading states
export const simulateApiDelay = <T>(data: T, ms: number = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

// Mock function to get all conversations - replace with actual API call
export const fetchConversations = async (): Promise<Conversation[]> => {
  return simulateApiDelay(mockConversations);
};

// Mock function to get a single conversation - replace with actual API call
export const fetchConversation = async (id: string): Promise<Conversation | undefined> => {
  const conversation = mockConversations.find((c) => c.id === id);
  return simulateApiDelay(conversation);
};

// Mock function to send a message - replace with actual API call
export const sendMessage = async (
  conversationId: string,
  content: string
): Promise<{ userMessage: Message; assistantMessage: Message }> => {
  const userMessage: Message = {
    id: `${conversationId}-${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date(),
  };

  // Simulated assistant response
  const assistantMessage: Message = {
    id: `${conversationId}-${Date.now() + 1}`,
    role: 'assistant',
    content: `This is a mock response to: "${content}"\n\nReplace this mock function with your actual API call to get real responses from your AI backend.`,
    timestamp: new Date(),
  };

  return simulateApiDelay({ userMessage, assistantMessage }, 1000);
};

// Mock function to create a new conversation - replace with actual API call
export const createConversation = async (firstMessage: string): Promise<Conversation> => {
  const newConversation: Conversation = {
    id: `new-${Date.now()}`,
    title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [],
  };

  return simulateApiDelay(newConversation, 300);
};
