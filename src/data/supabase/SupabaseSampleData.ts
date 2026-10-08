import type { SampleDataService } from '../repositories'
import type { Db } from './client'
import { assertOk } from './errors'

export class SupabaseSampleData implements SampleDataService {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async load() {
    // Server-side function: acts on the caller's own rows and does nothing if they have data.
    assertOk(await this.db.rpc('seed_sample_journal'))
  }
}
