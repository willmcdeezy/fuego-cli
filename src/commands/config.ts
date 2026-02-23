import chalk from 'chalk';
import { getConfig, setConfig, listConfig } from '../lib/config.js';

interface ConfigOptions {
  get?: string;
  set?: string;
  list?: boolean;
}

export async function configCommand(options: ConfigOptions): Promise<void> {
  try {
    if (options.get) {
      const value = getConfig(options.get);
      console.log(value ?? chalk.gray('(not set)'));
    } else if (options.set) {
      const [key, ...valueParts] = options.set.split('=');
      const value = valueParts.join('=');
      
      if (!key || value === undefined) {
        console.log(chalk.red('Usage: fuego config --set key=value'));
        process.exit(1);
      }
      
      setConfig(key, value);
      console.log(chalk.green(`✅ Set ${key} = ${value}`));
    } else if (options.list) {
      const config = listConfig();
      console.log(chalk.cyan.bold('\n⚙️  Fuego Configuration\n'));
      for (const [key, value] of Object.entries(config)) {
        console.log(`${chalk.white(key)}: ${chalk.cyan(value)}`);
      }
    } else {
      console.log(chalk.yellow('Use --get, --set, or --list'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}
