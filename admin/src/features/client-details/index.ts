export { default as ClientDetailsForm } from './components/ClientDetailsForm';
export { default as ClientDetailsDeleteAlert } from './components/ClientDetailsDeleteAlert';
export {
  useClientsQuery,
  useToggleClientStatus,
  useDeleteClient,
} from './hooks/useClientDetailsQueries';
export type {
  Client,
  PaginationInfo,
  ClientsResponse,
  UseClientsQueryParams,
} from './types';
