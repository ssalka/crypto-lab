import _ from 'lodash/fp';

type MoneyAmount = string;

function isMoneyAmount(value: string): value is MoneyAmount {
  return /^[\d.]+$/.test(value);
}

export function formatUSD(value: string | number) {
  const stringValue = value.toString();

  return !isMoneyAmount(stringValue)
    ? stringValue
    : '$' + insertSeparators(stringValue);
}

function insertSeparators(value: string, separator = ','): MoneyAmount {
  if (value.includes(separator)) return value;

  const [
    integerValue,
    decimalValue = ''
  ] = _.split('.', value);

  return _.flow(
    _.split('.'),
    _.first,
    _.reverse,
    _.chunk(3),
    _.reverse,
    _.map(_.join('')),
  )(integerValue) + (decimalValue && '.' + decimalValue);
}
