import { FolderParams } from './folder.params';
import { AgentParams } from './agent.params';
import { CreditParams } from './credit.params';
import { PaymentClientParams } from './payment.client.params';
import { PaymentParams } from './payment.params';
import { LeaderParams } from './leader.params';
import { UserParams } from './user.params';
import { MunicipalityParams } from './municipality.params';
import { RouteParams } from './route.params';
import { SecurityParams } from './security.params';
import { TownParams } from './town.params';
import { PermissionParams } from './permission.params';
import { HistoryPaymentParams } from './historyPayments.params';

function buildParams() {
    return  {
        folder: FolderParams(),
        credit: CreditParams(),
        agent: AgentParams(),
        paymentClient: PaymentClientParams(),
        payment: PaymentParams(),
        leader: LeaderParams(),
        user: UserParams(),
        municipality: MunicipalityParams(),
        route: RouteParams(),
        security: SecurityParams(),
        town: TownParams(),
        permission: PermissionParams(),
        history: HistoryPaymentParams()
    }
}

export const Params = buildParams();