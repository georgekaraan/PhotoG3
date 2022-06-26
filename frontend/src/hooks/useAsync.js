//React hook for easiser work with fetching
import { useEffect, useState } from "react";

const useAsync = (promise, deps = []) => {
    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        const work = async() => {
            try {
                const res = await promise;

                setResult(res);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        work();
    }, deps);

    return { result, isLoading, error };
};

export default useAsync;