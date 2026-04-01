import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-pagination',
  imports: [],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.scss',
})
export class TablePagination {
	@Input() currentPage: number = 1;
	@Input() totalPages: number = 1;
	@Input() pageSize: number = 10;
	@Output() pageChanged = new EventEmitter<number>();

	protected readonly Math = Math;

	getTotalPages(): number {
		return Math.ceil(this.totalPages / this.pageSize);
	}

	get pages(): number[] {
		return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
	}

	changePage(page: number): void {
		if (page >= 1 && page <= this.getTotalPages()) {
			this.currentPage = page;
			this.pageChanged.emit(this.currentPage);
		}
	}
}
