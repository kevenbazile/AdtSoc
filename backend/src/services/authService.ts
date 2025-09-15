import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'business-jarvis-demo-secret';

export class AuthService {
  // Register a new user
  static async register(data: {
    email: string;
    name: string;
    password: string;
    organizationName?: string;
  }) {
    try {
      console.log('AuthService.register called with:', { email: data.email, name: data.name, hasOrg: !!data.organizationName });

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log('Password hashed successfully');

      // Create or find organization
      let organization;
      if (data.organizationName) {
        console.log('Creating new organization:', data.organizationName);
        organization = await prisma.organization.create({
          data: {
            name: data.organizationName,
            domain: data.email.split('@')[1]
          }
        });
      } else {
        console.log('Looking for default organization...');
        organization = await prisma.organization.findFirst();
        if (!organization) {
          console.log('Creating default organization...');
          organization = await prisma.organization.create({
            data: {
              name: 'Default Organization',
              domain: 'default.local'
            }
          });
        }
      }

      console.log('Organization ready:', organization.name);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          hashedPassword,
          organizationId: organization.id,
          role: data.organizationName ? 'OWNER' : 'USER'
        },
        include: {
          organization: true
        }
      });

      console.log('User created successfully:', user.email);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          organizationId: user.organizationId,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization
        },
        token
      };
    } catch (error) {
      console.error('AuthService.register error:', error);
      throw error;
    }
  }

  // Login user
  static async login(email: string, password: string) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          organizationId: user.organizationId,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization
        },
        token
      };
    } catch (error) {
      console.error('AuthService.login error:', error);
      throw error;
    }
  }

  // Verify JWT token
  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
