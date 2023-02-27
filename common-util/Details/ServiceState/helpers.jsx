export const SERVICE_STATE_HELPER_LABELS = {
  'pre-registration': 'The service has just been registered.',
  'active-registration':
    'The service is waiting for agent operators to register their agent instances.',
  'finished-registration':
    'All agent instance slots have been filled. Waiting for the service owner to continue deploying the service.',
  deployed:
    'The service is in default operational state. Agent operators can turn on their agent instances at this point.',
  terminated:
    'The service has been terminated by the service owner and the service is waiting for the owner to unbond all registered agents.',
};
