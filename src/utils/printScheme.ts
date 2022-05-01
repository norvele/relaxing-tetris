export function printScheme(scheme: any) {
  const result = scheme
    .map((row: any) => {
      return row.join(" ");
    })
    .join("\n");
  console.log(result);
}
