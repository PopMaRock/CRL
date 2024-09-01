import * as fs from 'fs';
import * as path from 'path';
import * as tracery from 'tracery-grammar';

/**
 * Applies grammar rules to generate a string based on the provided key.
 * 
 * @param key - The key to use for generating the string.
 * @param rules - The grammar rules to apply.
 * @returns The generated string.
 */
export function applyGrammar(key: string, rules: any): string {
    const grammar = tracery.createGrammar(rules);
    grammar.addModifiers(tracery.baseEngModifiers);
    return grammar.flatten(`#${key}#`);
}

/**
 * Loads grammar rules from a JSON file based on the provided setting.
 * 
 * @param setting - The setting to use for loading the rules.
 * @returns The loaded grammar rules.
 */
export function loadRules(setting: string): any {
    const filePath = path.join(path.dirname(__filename), `${setting}_rules.json`);
    const rules = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return rules;
}

/**
 * Provides a randomized prompt according to the grammar rules in <setting>_rules.json.
 * 
 * @param setting - The setting to use for loading the rules.
 * @param characterType - The character type to use for generating the prompt.
 * @param key - The key to use for generating the prompt.
 * @returns The generated prompt.
 */
export function generate(setting: string, characterType: string, key: string): string {
    const rules = loadRules(setting);
    const artefact = applyGrammar(`${characterType}_${key}`, rules);
    return artefact;
}

/**
 * Directly applies grammar rules to generate a string based on the provided key.
 * 
 * @param setting - The setting to use for loading the rules.
 * @param key - The key to use for generating the string.
 * @returns The generated string.
 */
export function direct(setting: string, key: string): string {
    const rules = loadRules(setting);
    const artefact = applyGrammar(key, rules);
    return artefact;
}