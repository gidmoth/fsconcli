/**
 * generic fetch hook
 */

import { useState } from "react";

function useFetch(apiorigin) {
    const [loading, setLoading] = useState(true);

    function get(url) {
        return new Promise((resolve, reject) => {
            fetch(apiorigin + url, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function post(url, body) {
        return new Promise((resolve, reject) => {
            fetch(apiorigin + url, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    return { get, post, loading };
};

export default useFetch