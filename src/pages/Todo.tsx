import React, { FunctionComponent, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Fab,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import AppTable, { ColumnProps } from "../components/AppTable";
import TodoFormDialog from '../components/TodoFormDialog';
import usePagination from '../components/usePagination';
import { ITodo } from '../models/todo';
import { useMutation, useQuery } from '@apollo/client';
import { deleteMutation, TodoQuery } from '../graphql/todo';


const Todo: FunctionComponent = () => {

    const { data, loading } = useQuery(TodoQuery)

    console.log(data);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [menuFor, setMenuFor] = useState<ITodo>();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [deleteTodo] = useMutation(deleteMutation, { refetchQueries: [TodoQuery] });

    const {
        pagination,
        handlePageNumberChange,
        handlePageSizeChange,
    } = usePagination();

    const handleClick = (
        event: React.MouseEvent<HTMLElement>,
        record: ITodo
    ) => {
        setAnchorEl(event.currentTarget);
        setMenuFor(record);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns: ColumnProps<ITodo> = [
        {
            title: "S.N",
            render: (_, __, index) =>
                pagination.pageNumber * pagination.pageSize + index + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description"
        },
        {
            title: "Actions",
            render: (_, record) => (
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleClick(e, record)}
                >
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];


    const handleDelete: React.MouseEventHandler<HTMLLIElement> = async () => {
        const confirm = window.confirm(
            "Are you sure you want to delete this priority ?"
        );

        if (confirm && menuFor) {
            await deleteTodo({
                variables: {
                    id: menuFor.id
                }
            })
            handleClose()
        }

    };

    if (loading) return <>Loading ...</>

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>

                        <AppTable
                            columns={columns}
                            currentPage={pagination.pageNumber}
                            currentPageSize={pagination.pageSize}
                            pageSizeOptions={[25, 50, 75]}
                            dataSource={data.todos ?? []}
                            totalCount={data?.totalCount ?? 0}
                            onPageChange={handlePageNumberChange}
                            onPageSizeChange={handlePageSizeChange}
                            loading={!data}
                        />
                    </Typography>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={!!anchorEl}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={() => {
                                setIsDialogOpen(true);
                                handleClose();
                            }}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </CardContent>
            </Card>

            <Fab
                size="small"
                color="primary"
                aria-label="add"
                style={{ position: "fixed", bottom: "32px", right: "32px" }}
                onClick={() => setIsDialogOpen(true)}
            >
                <AddIcon />
            </Fab>

            {isDialogOpen && (
                <TodoFormDialog
                    open={isDialogOpen}
                    onDiscard={() => {
                        setMenuFor(undefined);
                        setIsDialogOpen(false);
                    }}
                    onSuccess={() => {
                        setMenuFor(undefined);
                        setIsDialogOpen(false);
                    }}
                    edit={menuFor}
                />
            )}
        </>
    );
};

export default Todo;