import yargs from "yargs";
import consumers from 'stream/consumers'
import { createReadStream, writeFile } from 'fs'
import { language } from './parser/smtlib.js'
import { fromNNF } from './transformations/cnf.js'
import { convertToString } from './writer/dimacs.js'
import { EOL } from 'os'

const args = yargs(process.argv.slice(2)).command("$0 [in-file [out-file]]", '')
  .positional("in-file", { string: true, type: 'string', desc: 'File to be written from', default: null }).
  positional("out-file", { string: true, type: 'string', desc: 'File to be written to', default: null }).
  options({
    useEquivalences: { boolean: true, default: true, alias: "use-equivalences" },
  }).parseSync()

const input = args.inFile ? await consumers.text(createReadStream(args.inFile)) : await consumers.text(process.stdin);
const parsed = language.formula.parse(input)
if (parsed.status) {
  const [formula, desc] = fromNNF(parsed.value, args.useEquivalences);
  const strFormula = convertToString(formula);
  args.outFile ? writeFile(args.outFile, [desc.join(EOL), strFormula].join(EOL), () => { console.log("Succesfully written output.") }) : console.log([desc.join(EOL), strFormula].join(EOL))

} else {
  console.log(parsed)
}