import * as React from 'react';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { classNames, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { thumbnailPlugin, RenderThumbnailItemProps } from '../src';

const TestRenderThumbnailItem: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.pageIndex}
            className={classNames({
                'custom-thumbnail-item': true,
                'custom-thumbnail-item--selected': props.pageIndex === props.currentPage,
            })}
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
            }}
            onClick={props.onJumpToPage}
        >
            {props.renderPageThumbnail}
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                height: '50rem',
                width: '50rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    overflow: 'auto',
                    width: '30%',
                }}
            >
                <Thumbnails renderThumbnailItem={renderThumbnailItem} />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
            </div>
        </div>
    );
};

test('Test renderThumbnailItem option', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestRenderThumbnailItem fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 559;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => screen.getByTestId('core__doc-loading'));

    const pagesContainer = getByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 559,
        width: 800,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const thumbnailsContainer = await findByTestId('thumbnail__list');
    expect(thumbnailsContainer.querySelectorAll('.custom-thumbnail-item').length).toEqual(8);

    // Find the second thumbnail
    let secondThumbnail = await findByTestId('thumbnail-1');
    expect(secondThumbnail).toHaveClass('custom-thumbnail-item');

    // Scroll to the second page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 658,
        },
    });

    // Wait until the second thumbnail is rendered
    let secondThumbnailContainer = await findByTestId('thumbnail__container-1');
    mockIsIntersecting(secondThumbnailContainer, true);

    const secondThumbnailImage = await findByLabelText('Thumbnail of page 2');
    const src = secondThumbnailImage.getAttribute('src');
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQV'
    );
    expect(src.length).toEqual(11582);
});
