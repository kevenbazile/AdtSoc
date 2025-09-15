import { WorkflowEngine } from '../engine';
import { HttpExecutor } from './http';
import { EmailExecutor } from './email';
import { DelayExecutor } from './delay';
import { TransformExecutor } from './transform';

export function registerAllExecutors(engine: WorkflowEngine) {
  engine.registerExecutor('http', new HttpExecutor());
  engine.registerExecutor('email', new EmailExecutor());
  engine.registerExecutor('delay', new DelayExecutor());
  engine.registerExecutor('transform', new TransformExecutor());
  
  console.log('✅ All node executors registered');
}

export * from './http';
export * from './email';
export * from './delay';
export * from './transform';
