import React from "react";
import { Link } from "react-router-dom";
import { meQuery } from './graphql/me'
import { logoutMutation } from './graphql/logout'
import { setAccessToken } from "./accessToken";
import { useMutation, useQuery } from '@apollo/client';

interface Props { }

export const Header: React.FC<Props> = () => {
    const { data, loading } = useQuery(meQuery)
    const [logout, { client }] = useMutation(logoutMutation)

    let body: any = null;

    if (loading) {
        body = null;
    } else if (data && data.me) {
        body = <div>you are logged in as: {data.me.email}</div>;
    } else {
        body = <div>not logged in</div>;
    }

    return (
        <header>
            <div>
                <Link to="/register">register</Link>
            </div>
            <div>
                <Link to="/login">login</Link>
            </div>
            <div>
                {!loading && data && data.me ? (
                    <button
                        onClick={async () => {
                            await logout();
                            setAccessToken("");
                            await client!.resetStore();
                        }}
                    >
                        logout
                    </button>
                ) : null}
            </div>
            {body}
        </header>
    );
};