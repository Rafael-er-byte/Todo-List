import type IdMember from "../../../member/core/objects/IdMember";
import type MemberInfo from "../../../member/core/objects/MemberInfo";
import type None from "../objects/None";
import type iActor from "./contracts/iActor";

export default class MemberActor implements iActor{
    id!: IdMember;
    memberInfo!: MemberInfo;

    constructor(id: IdMember, memberInfo:MemberInfo){
        this.id = id;
        this.memberInfo = memberInfo;
    }

    getName(): string {
        return this.memberInfo.getUserName();
    }

    getImage(): string | None {
        return this.memberInfo.getUrlProfileImage();
    }
}
