( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var Button = components.Button;

	function withField( items, index, field, value ) {
		var next = items.slice();
		next[ index ] = Object.assign( {}, next[ index ] );
		next[ index ][ field ] = value;
		return next;
	}

	function renderPreview( tiles, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-stat-tiles' },
			tiles.map( function ( tile, index ) {
				return el(
					'div',
					{ key: index, className: 'tvgf-stat-tile' },
					el( 'div', { className: 'tvgf-stat-value' }, tile.value ),
					el( 'div', { className: 'tvgf-stat-label' }, tile.label ),
					tile.trend ? el( 'div', { className: 'tvgf-stat-trend' }, tile.trend ) : null
				);
			} )
		);
	}

	registerBlockType( 'tvgf/stat-tiles', {
		edit: function ( props ) {
			var tiles = props.attributes.tiles || [];
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-stat-tiles-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Stat Tiles — preview' ),
				renderPreview( tiles ),
				el( 'p', { className: 'tvgf-block-label' }, 'Edit tiles' ),
				tiles.map( function ( tile, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-stat-tile-row' },
						el( TextControl, {
							label: 'Value (e.g. 87%)',
							value: tile.value || '',
							onChange: function ( v ) {
								setAttributes( { tiles: withField( tiles, index, 'value', v ) } );
							},
						} ),
						el( TextControl, {
							label: 'Label',
							value: tile.label || '',
							onChange: function ( v ) {
								setAttributes( { tiles: withField( tiles, index, 'label', v ) } );
							},
						} ),
						el( TextControl, {
							label: 'Trend note (optional)',
							value: tile.trend || '',
							onChange: function ( v ) {
								setAttributes( { tiles: withField( tiles, index, 'trend', v ) } );
							},
						} ),
						el(
							Button,
							{
								isDestructive: true,
								variant: 'secondary',
								onClick: function () {
									var next = tiles.slice();
									next.splice( index, 1 );
									setAttributes( { tiles: next } );
								},
							},
							'Remove'
						)
					);
				} ),
				el(
					Button,
					{
						variant: 'primary',
						onClick: function () {
							setAttributes( { tiles: tiles.concat( [ { value: '', label: '', trend: '' } ] ) } );
						},
					},
					'+ Add tile'
				)
			);
		},
		save: function ( props ) {
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-stat-tiles' } );
			return renderPreview( props.attributes.tiles || [], blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
