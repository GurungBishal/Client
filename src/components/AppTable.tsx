import { FunctionComponent, ReactNode } from "react";
import {
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TableBody,
    TableRow,
    makeStyles,
    createStyles,
    Theme,
    TablePagination,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableHeader: {
            background: theme.palette.grey[100],
        },
    })
);


interface RowProp<G = any> {
    onClick: (record: G) => void;
}

interface ColumnProp<G = any> {
    title?: string;
    titleTooltip?: string;
    dataIndex?: keyof G;
    render?: (value: any, record: G, index: number) => ReactNode;
}

export type ColumnProps<G = any> = ColumnProp<G>[];

export interface AppTableProps<G = any> {
    columns: ColumnProps<G>;
    rowProp?: RowProp<G>;
    dataSource: any[];
    currentPage: number;
    currentPageSize: number;
    pageSizeOptions: number[];
    totalCount: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export type TablePaginationProps = Record<"pageSize" | "pageNumber", number>;

const AppTable: FunctionComponent<AppTableProps> = ({
    columns,
    rowProp,
    dataSource,
    currentPage,
    currentPageSize,
    pageSizeOptions,
    totalCount,
    loading,
    onPageChange,
    onPageSizeChange,
}) => {
    const classes = useStyles();

    const createSkeleton = () => {
        const rows: ReactNode[] = [];
        for (let i = 0; i < currentPageSize; i++) {
            rows.push(
                <TableRow>
                    {columns.map((_, index) => {
                        return (
                            <TableCell key={index}>
                                <Skeleton />
                            </TableCell>
                        );
                    })}
                </TableRow>
            );
        }
        return rows;
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead className={classes.tableHeader}>
                        {columns.map(({ title, titleTooltip }, index) => {
                            return (
                                <TableCell title={titleTooltip} key={index}>
                                    {title}
                                </TableCell>
                            );
                        })}
                    </TableHead>
                    <TableBody>
                        {loading
                            ? createSkeleton()
                            : dataSource.map((data, rowIndex) => {
                                return (
                                    <TableRow
                                        onClick={() => rowProp?.onClick(data)}
                                        key={rowIndex}

                                    >
                                        {columns.map(({ dataIndex, render }, colIndex) => {
                                            return (
                                                <TableCell key={`${rowIndex}-${colIndex}`}>
                                                    {render
                                                        ? render(
                                                            dataIndex ? data[dataIndex] : "",
                                                            data,
                                                            rowIndex
                                                        )
                                                        : dataIndex
                                                            ? data[dataIndex]
                                                            : ""}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPage={currentPageSize}
                    component="div"
                    count={totalCount}
                    rowsPerPageOptions={pageSizeOptions}
                    page={currentPage}
                    onRowsPerPageChange={(e) =>
                        onPageSizeChange(parseInt(e.target.value, 10))
                    }
                    onPageChange={(_, page) => onPageChange(page)}
                />
            </TableContainer>
        </>
    );
};

export default AppTable;