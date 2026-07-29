/**
 * The row model. This is the single source of truth: rename or remove a
 * property here and every column definition below (and any cell template)
 * that references it will fail to compile.
 */
export interface Tenant {
  id: number;
  tenancyName: string;
  name: string;
  editionDisplayName: string;
  subscriptionEndDateUtc: string | null;
  isActive: boolean;
  creationTime: string;
  connectionString?: string;
}
