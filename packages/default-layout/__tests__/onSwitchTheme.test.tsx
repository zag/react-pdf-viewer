import * as React from 'react';
import { act, fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestOnSwitchTheme: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [theme, setTheme] = React.useState('');
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div>
            <div>
                Current theme: <span data-testid="current-theme">{theme}</span>
            </div>
            <div
                style={{
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} onSwitchTheme={setTheme} plugins={[defaultLayoutPluginInstance]} />
            </div>
        </div>
    );
};

test('onSwitchTheme() callback', async () => {
    const { findByTestId, findByText, getByLabelText, getByTestId } = render(
        <TestOnSwitchTheme fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    await findByTestId('core__text-layer-0');

    // Click the switch theme button
    const switchButton = await getByLabelText('Switch to the dark theme');
    fireEvent.click(switchButton);

    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(true);

    // const currentThemeLabel = await findByTestId('current-theme');
    // expect(currentThemeLabel.textContent).toEqual('dark');

    // // Click again to switch back to the light theme
    // const switchLightButton = await getByLabelText('Switch to the light theme');
    // fireEvent.click(switchLightButton);

    // expect(viewerEle.classList.contains('rpv-core__viewer--light')).toEqual(true);
    // expect(currentThemeLabel.textContent).toEqual('light');
});
