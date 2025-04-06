import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

export default function Index() {
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (navigationState?.key) {
            router.replace('/auth/login');
        }
    }, [navigationState]);

    return null;


}