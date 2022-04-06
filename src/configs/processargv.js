import ParsedArgs from "minimist";

const options = { default:{port: 8080, mode: 'fork'}}

export default ParsedArgs(process.argv.slice(2), options)