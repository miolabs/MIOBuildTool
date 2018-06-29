import { ModelEntityReference } from "./modelEntity.reference";
import { ModelEntityModule } from "./modelEntity.module";

export function modelEntityFactory(entity: any, isModule: boolean) {
    if (isModule) {
        return new ModelEntityModule(entity);
    } else {
        return new ModelEntityReference(entity);
    }
}
