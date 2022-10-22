import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { TransactionResponseDTO } from "../dto/transaction-response.dto";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class TransactionMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Transaction, TransactionResponseDTO)
    }
  }
}