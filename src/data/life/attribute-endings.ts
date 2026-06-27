// src/data/life/attribute-endings.ts
import type { AttributeName } from "../../engine/types";

export interface AttributeEndingDefinition {
  attribute: AttributeName;
  title: string;
  triggerText: string;
  description: string;
  flavorText: string;
  highlight: string;
}

export const ATTRIBUTE_ENDINGS: AttributeEndingDefinition[] = [
  {
    attribute: "luck",
    title: "承命应赦",
    triggerText: "运势抵达极值。你终于意识到，好运不是礼物，而是一张迟早会递来的赦免书。",
    description: "你的一生被太多偶然托住。危险绕开你，机会落向你，失败也总在最后一刻改写。",
    flavorText: "命运赦免了你，却没有说明代价。",
    highlight: "运势满溢——所有侥幸都被写进账本",
  },
  {
    attribute: "creativity",
    title: "残梦遗书",
    triggerText: "才脉抵达极值。灵感不再只是从你心里生长，它开始回头凝视你。",
    description: "你留下了足够动人的作品，也逐渐分不清自己是在创作，还是被那些作品反向书写。",
    flavorText: "你写完了作品，也被作品写了进去。",
    highlight: "才脉满溢——灵感终于反过来书写你",
  },
  {
    attribute: "intelligence",
    title: "彻明演算",
    triggerText: "智力抵达极值。世界在你眼前变得清楚，清楚到再也没有什么能够突然打动你。",
    description: "你看懂了太多因果、概率与人心。答案越来越多，惊喜却越来越少。",
    flavorText: "你算尽了路径，也算空了惊喜。",
    highlight: "智力满溢——世界清楚得近乎荒凉",
  },
  {
    attribute: "wealth",
    title: "仓满余生",
    triggerText: "家境抵达极值。账目归拢，仓廪已满，整座城市都像一张账本。",
    description: "你拥有了足够多的资源，也因此成为无数期待、请求与交换汇聚的节点。",
    flavorText: "仓廪已满，真正留下的人反而更少。",
    highlight: "家境满溢——城市像一张巨大的账本",
  },
  {
    attribute: "physique",
    title: "赤脉永生",
    triggerText: "体质抵达极值。你的身体近乎不肯衰败，可岁月仍在旁人身上安静发生。",
    description: "你被强健的身体托到很远的地方，却也被它困在无法替别人老去的孤独里。",
    flavorText: "身体不肯衰败，岁月却照样带走旁人。",
    highlight: "体质满溢——强健也会成为牢笼",
  },
  {
    attribute: "appearance",
    title: "侧目映身",
    triggerText: "颜值抵达极值。所有人的目光都落在你身上，你却越来越难确认他们看见的是谁。",
    description: "你被偏爱、凝视、误解，也被无数欲望塑造成别人想象中的样子。",
    flavorText: "众人看见你的脸，却很少看见你。",
    highlight: "颜值满溢——被凝视，也被替代",
  },
];

export function getAttributeEnding(attributes: Partial<Record<AttributeName, number>>): AttributeEndingDefinition | null {
  return ATTRIBUTE_ENDINGS.find((ending) => (attributes[ending.attribute] ?? 0) >= 100) ?? null;
}

export function getAttributeEndingByAttribute(attribute: AttributeName | null | undefined): AttributeEndingDefinition | null {
  if (!attribute) return null;
  return ATTRIBUTE_ENDINGS.find((ending) => ending.attribute === attribute) ?? null;
}
