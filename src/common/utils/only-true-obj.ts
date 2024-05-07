export default function onlyTrueObj(
  condition: boolean,
  trueObj: Darwish.AnyObj,
) {
  return condition ? trueObj : {};
}
