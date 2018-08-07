import { ModelEntityReference } from "./modelEntity.reference";
import { ModelEntityModule } from "./modelEntity.module";

export function modelEntityFactory(entity: any, params: any) {
    if (params.module) {
        return new ModelEntityModule(entity, params);
    } else {
        return new ModelEntityReference(entity, params);
    }
}
