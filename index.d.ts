/**
 * Make sure we can import .gql files.
 */
declare module '*.gql' {
    const content: any
    export default content
}
