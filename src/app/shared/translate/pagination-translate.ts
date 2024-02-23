import { TranslateService } from '@ngx-translate/core';
import {MatPaginatorIntl} from '@angular/material/paginator';

export class PaginationTranslate {
  constructor(private translateService: TranslateService) {}

  getPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = this.translateService.instant('COMMON.PAGINATION.ITEMS_PER_PAGE_LABEL');
    paginatorIntl.nextPageLabel = this.translateService.instant('COMMON.PAGINATION.NEXT_PAGE_LABEL');
    paginatorIntl.previousPageLabel = this.translateService.instant('COMMON.PAGINATION.PREVIOUS_PAGE_LABEL');
    paginatorIntl.firstPageLabel = this.translateService.instant('COMMON.PAGINATION.FIRST_PAGE_LABEL');
    paginatorIntl.lastPageLabel = this.translateService.instant('COMMON.PAGINATION.LAST_PAGE_LABEL');
    paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
    return paginatorIntl;
  }
  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
        return this.translateService.instant('COMMON.PAGINATION.RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translateService.instant('COMMON.PAGINATION.RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
}
}
