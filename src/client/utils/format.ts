import _ from 'lodash/fp';

type MoneyAmount = string;

function isMoneyAmount(value: string): value is MoneyAmount {
  return /^[\d.]+$/.test(value);
}

export function formatUSD(value: string | number) {
  if (_.isNil(value)) return '$0';

  const stringValue = value.toString();

  return !isMoneyAmount(stringValue)
    ? stringValue
    : '$' + insertSeparators(stringValue);
}

// HACK: workaround for incomplete lodash typedefs
const flatMap: typeof _.flatMap = (_.flatMap as any).convert({ cap: false });

const insertChain = separator => [
  _.toArray,
  _.reverse,
  flatMap((char, i, arr) => {
    if ([0, arr.length - 1].includes(i) || (i + 1) % 3) return char;
    else return [char, separator];
  }),
  _.reverse,
  _.join('')
];

function insertSeparators(value: string, separator = ','): MoneyAmount {
  if (value.includes(separator)) return value;

  const [integerValue, decimalValue = ''] = _.split('.', value);

  const spliceSeparators: (val: string) => string = integerValue.length <= 3
    ? _.identity
    : _.flow(insertChain(separator));

  return spliceSeparators(integerValue) + (decimalValue && '.' + decimalValue);
}
