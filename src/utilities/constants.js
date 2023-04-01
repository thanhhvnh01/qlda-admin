export const EmailPhoneNumberRegExp =
  /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$|^(?=(?:\D*\d){10,15}\D*$)\+?[0-9]{1,3}[\s-]?(?:\(0?[0-9]{1,5}\)|[0-9]{1,5})[-\s]?[0-9][\d\s-]{5,7}\s?(?:x[\d-]{0,4})?$/; /* eslint-disable-line */

export const UserTypeTypeEnum = {
  SuperAdmin: 0,
  Admin: 1,
};

export const OrderByTypeEnum = {
  Asc: 0,
  Desc: 1,
};

export const PhysicalFileTypeEnum = {
  Image: 1,
};

export const PhysicalFileStatusEnum = {
  New: 0,
  OK: 1,
  WillBeDeleted: 2,
  Deleted: 3,
  Corrupted: 4,
};

export const HairStyleEnum = {
  Straight: 1,
  KinkyStraight: 2,
  Wave: 3,
  BodyWave: 4,
  LooseWay: 5,
  DeepWave: 6,
  Curly: 7,
  CurlyWave: 8,
  KinkyCurly: 9,
};

export const HairStyleDisplayConfig = {
  [HairStyleEnum.Straight]: 'Straight',
  [HairStyleEnum.KinkyStraight]: 'KinkyStraight',
  [HairStyleEnum.Wave]: 'Wave',
  [HairStyleEnum.BodyWave]: 'BodyWave',
  [HairStyleEnum.LooseWay]: 'LooseWay',
  [HairStyleEnum.DeepWave]: 'DeepWave',
  [HairStyleEnum.Curly]: 'Curly',
  [HairStyleEnum.CurlyWave]: 'CurlyWave',
  [HairStyleEnum.KinkyCurly]: 'KinkyCurly',
};

export const MaterialTypeEnum = {
  RemyHair: 1,
  VirginHair: 2,
};

export const MaterialTypeDisplayConfig = {
  [MaterialTypeEnum.RemyHair]: 'RemyHair',
  [MaterialTypeEnum.VirginHair]: 'VirginHair',
};

export const LengthMeasureUnitEnum = {
  Inch: 1,
  Centimeter: 2,
};

export const LengthMeasureUnitDisplayConfig = {
  [LengthMeasureUnitEnum.Inch]: 'Inch',
  [LengthMeasureUnitEnum.Centimeter]: 'Centimeter',
};

export const WeightMeasureUnitEnum = {
  Kilogram: 1,
  Pound: 2,
};

export const WeightMeasureUnitDisplayConfig = {
  [WeightMeasureUnitEnum.Kilogram]: 'Kilogram',
  [WeightMeasureUnitEnum.Pound]: 'Pound',
};

export const OriginEnum = {
  VietNam: 1,
};

export const OriginDisplayConfig = {
  [OriginEnum.VietNam]: 'VietNam',
};

export const PackingRuleEnum = {
  ClearPlasticBagWithSmallTag: 1,
  ClientsPackingAndLogoAccepted: 2,
};
