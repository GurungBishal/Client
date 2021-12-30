import { FunctionComponent, useRef, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogProps,
    TextField,
    Grid,
    Button,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Alert } from "@material-ui/lab";
import { useForm, Controller } from "react-hook-form";
import { ITodo } from '../models/todo';
import { useMutation } from '@apollo/client';
import { createMutation, TodoQuery, updateMutation } from '../graphql/todo';

interface TodoFormDialogProps extends DialogProps {
    onDiscard: () => void;
    onSuccess: () => void;
    edit?: ITodo;
}


const useStyles = makeStyles(() =>
    createStyles({
        formDialog: {
            minWidth: 500,
        },
    })
);

const TodoFormDialog: FunctionComponent<TodoFormDialogProps> = ({
    onDiscard,
    onSuccess,
    edit,
    ...rest
}) => {
    const [hasError, setHasError] = useState(false);
    const classes = useStyles();
    const { handleSubmit, control } = useForm<Partial<ITodo>>({
        defaultValues: {
            title: edit?.title ?? "",
            description: edit?.description ?? "",
        },
    });

    const [createTodo] = useMutation(createMutation, { refetchQueries: [TodoQuery] })

    const [updateTodo] = useMutation(updateMutation, { refetchQueries: [TodoQuery] })

    const submitButtonRef = useRef<HTMLInputElement | null>(null);

    const onSubmit = (data: Partial<ITodo>) => {
        if (edit) {
            updateTodo({
                variables: {
                    id: edit?.id,
                    title: data.title,
                    description: data.description
                }
            }).then(() => {
                onSuccess()
            }).catch(() => {
                setHasError(true)
            })
        }
        else {
            createTodo({
                variables: {
                    title: data.title,
                    description: data.description
                }
            }).then(() => {
                onSuccess()
            }).catch(() => {
                setHasError(true)
            })
        }
    };

    return (
        <>
            <Dialog {...rest}>
                <DialogTitle>Add Todo Form</DialogTitle>

                <DialogContent className={classes.formDialog}>
                    {hasError && (
                        <Alert severity="error">
                            Failed. Please Try Again Later
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <Controller
                                    name="title"
                                    rules={{ required: "Title is required" }}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => {
                                        return (
                                            <TextField
                                                fullWidth
                                                label="Title"
                                                error={!!error}
                                                {...field}
                                                helperText={error?.message ?? null}
                                            />
                                        );
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="description"
                                    rules={{ required: "Description is required" }}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => {
                                        return (
                                            <TextField
                                                fullWidth
                                                label="Description"
                                                error={!!error}
                                                {...field}
                                                helperText={error?.message ?? null}
                                            />
                                        );
                                    }}
                                />
                            </Grid>

                        </Grid>

                        <input type="submit" ref={submitButtonRef} hidden />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDiscard} variant="contained">
                        Discard
                    </Button>
                    <Button
                        onClick={() => submitButtonRef?.current?.click()}
                        color="primary"
                        variant="contained"
                    >
                        {edit ? "Update" : "Submit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TodoFormDialog;