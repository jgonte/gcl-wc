export type Constructor = new () => any;

// type Mixin<BaseMembers, MixinMembers> = <T extends HTMLElement & BaseMembers>(
//     Base: Constructor<T>
// ) => Constructor<T & MixinMembers>;