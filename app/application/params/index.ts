import { FolderParams } from './folder.params';
import { AgentParams } from './agent.params';
import { CreditParams } from './credit.params';
import { PaymentClientParams } from './payment.client.params';
import { PaymentParams } from './payment.param';

function buildParams() {
    return  {
        folder: FolderParams(),
        credit: CreditParams(),
        agent: AgentParams(),
        paymentClient: PaymentClientParams(),
        payment: PaymentParams(),
    }
}

export const Params = buildParams();